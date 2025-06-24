import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

interface AuthRequest extends Request {
  user?: any;
}


const TAG_CATEGORIES = [
  'Image',
  'Video', 
  'News',
  'Blog',
  'Music',
  'Social Media Post'
];

const extractMetadata = async (url: string) => {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
   
    const title = $('meta[property="og:title"]').attr('content') || 
                  $('title').text() || 
                  $('h1').first().text() || 
                  'Untitled';

    
    const description = $('meta[property="og:description"]').attr('content') || 
                       $('meta[name="description"]').attr('content') || 
                       '';


    const image = $('meta[property="og:image"]').attr('content') || 
                  $('meta[name="twitter:image"]').attr('content') || 
                  '';

  
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');

    
    const pageText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 3000);

    return {
      title: title.trim(),
      description: description.trim(),
      image: image || null,
      domain,
      pageText
    };
  } catch (error) {
    console.error('Error extracting metadata:', error);
    const urlObj = new URL(url);
    return {
      title: 'Unable to fetch title',
      description: '',
      image: null,
      domain: urlObj.hostname.replace('www.', ''),
      pageText: ''
    };
  }
};

const generateAIContent = async (title: string, description: string, pageText: string, url: string) => {
  try {
   
    const tagPrompt = `
      Based on the following content, return ONLY the most relevant tags from this EXACT list:: ${TAG_CATEGORIES.join(', ')}.
      
      Title: ${title}
      Description: ${description}
      URL: ${url}
      Content: ${pageText.substring(0, 1000)}
      
      Return only the relevant tag names from the given categories, separated by commas. If none fit perfectly, choose the closest match or return empty.
    `;

    const tagResult = await model.generateContent(tagPrompt);
    const tagResponse = tagResult.response;
    const tagsText = tagResponse.text().trim();
    
    const tags = tagsText
      .split(',')
      .map(tag => tag.trim())
      .filter(tag =>TAG_CATEGORIES.some(cat => 
  cat.toLowerCase() === tag.toLowerCase()
));

  
    const summaryPrompt = `
      Create a concise 2-3 sentence summary of the following web page content:
      
      Title: ${title}
      Description: ${description}
      Content: ${pageText.substring(0, 2000)}
      
      Focus on the main points and key information. Keep it informative but brief.
    `;

    const summaryResult = await model.generateContent(summaryPrompt);
    const summaryResponse = summaryResult.response;
    const summary = summaryResponse.text().trim();

    return {
      tags,
      summary
    };
  } catch (error) {
    console.error('Error generating AI content:', error);
    return {
      tags: [],
      summary: 'Summary unavailable'
    };
  }
};


export const saveLink = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { url } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (!url) {
      res.status(400).json({ error: 'URL is required' });
      return;
    }

   
    try {
      new URL(url);
    } catch (error) {
      res.status(400).json({ error: 'Invalid URL format' });
      return;
    }

    
    const existingLink = await prisma.link.findFirst({
      where: {
        url,
        userId
      }
    });

    if (existingLink) {
      res.status(400).json({ error: 'Link already saved' });
      return;
    }

 
    const metadata = await extractMetadata(url);

    
    const aiContent = await generateAIContent(
      metadata.title,
      metadata.description,
      metadata.pageText,
      url
    );

    
    const link = await prisma.link.create({
      data: {
        url,
        title: metadata.title,
        description: metadata.description,
        image: metadata.image,
        domain: metadata.domain,
        tags: aiContent.tags,
        userId
      }
    });

    res.status(201).json({
      message: 'Link saved successfully',
      link: {
        id: link.id,
        url: link.url,
        title: link.title,
        description: link.description,
        image: link.image,
        domain: link.domain,
        tags: link.tags,
        createdAt: link.createdAt,
        summary: aiContent.summary
      }
    });
  } catch (error) {
    console.error('Save link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getLinks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    
    const totalLinks = await prisma.link.count({
      where: { userId }
    });

   
    const links = await prisma.link.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        url: true,
        title: true,
        description: true,
        image: true,
        domain: true,
        tags: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const totalPages = Math.ceil(totalLinks / limit);

    res.json({
      links,
      pagination: {
        currentPage: page,
        totalPages,
        totalLinks,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get links error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getLinkDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const linkId = parseInt(id);
    if (isNaN(linkId)) {
      res.status(400).json({ error: 'Invalid link ID' });
      return;
    }

    
    const link = await prisma.link.findFirst({
      where: {
        id: linkId,
        userId
      }
    });

    if (!link) {
      res.status(404).json({ error: 'Link not found' });
      return;
    }

    
    let aiSummary = 'Summary unavailable';
    try {
      
      const metadata = await extractMetadata(link.url);
      const aiContent = await generateAIContent(
        link.title || '',
        link.description || '',
        metadata.pageText,
        link.url
      );
      aiSummary = aiContent.summary;
    } catch (error) {
      console.error('Error generating fresh summary:', error);
    }

    res.json({
      link: {
        id: link.id,
        url: link.url,
        title: link.title,
        description: link.description,
        image: link.image,
        domain: link.domain,
        tags: link.tags,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt,
        summary: aiSummary
      }
    });
  } catch (error) {
    console.error('Get link details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const deleteLink = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const linkId = parseInt(id);
    if (isNaN(linkId)) {
      res.status(400).json({ error: 'Invalid link ID' });
      return;
    }

   
    const link = await prisma.link.findFirst({
      where: {
        id: linkId,
        userId
      }
    });

    if (!link) {
      res.status(404).json({ error: 'Link not found' });
      return;
    }

   
    await prisma.link.delete({
      where: { id: linkId }
    });

    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const searchLinks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { q, tags } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const searchQuery = q as string;
    const tagFilter = tags as string;

    
    const whereClause: any = { userId };

    if (searchQuery) {
      whereClause.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { domain: { contains: searchQuery, mode: 'insensitive' } },
        { url: { contains: searchQuery, mode: 'insensitive' } }
      ];
    }

    if (tagFilter) {
      whereClause.tags = {
        has: tagFilter
      };
    }


    const totalLinks = await prisma.link.count({ where: whereClause });

    const links = await prisma.link.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        url: true,
        title: true,
        description: true,
        image: true,
        domain: true,
        tags: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const totalPages = Math.ceil(totalLinks / limit);

    res.json({
      links,
      pagination: {
        currentPage: page,
        totalPages,
        totalLinks,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      searchQuery,
      tagFilter
    });
  } catch (error) {
    console.error('Search links error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};