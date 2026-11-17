import { Router, Request, Response, NextFunction } from 'express';
import { readerService } from './reader.service';

export const readerRouter = Router();

/**
 * GET /api/v1/reader/books/:editionId
 * Returns complete textbook metadata, publisher, copyright status, and chapter list with access modes.
 */
readerRouter.get('/books/:editionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { editionId } = req.params;
    const book = await readerService.getBookDetails(editionId);
    if (!book) {
      res.status(404).json({ success: false, error: 'Textbook edition not found' });
      return;
    }
    res.json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/reader/chapters/:chapterId
 * Returns chapter reading metadata, permission mode, and companion document binding.
 */
readerRouter.get('/chapters/:chapterId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chapterId } = req.params;
    const chapter = await readerService.getChapterDetails(chapterId);
    if (!chapter) {
      res.status(404).json({ success: false, error: 'Chapter reading resource not found' });
      return;
    }
    res.json({ success: true, data: chapter });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/reader/documents/:documentId
 * Returns reader document metadata, license, and relative URL.
 */
readerRouter.get('/documents/:documentId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { documentId } = req.params;
    const doc = await readerService.getDocument(documentId);
    if (!doc) {
      res.status(404).json({ success: false, error: 'Document not found or not authorized for in-app reading' });
      return;
    }
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/reader/chapters/:chapterId/explanations
 * Returns contextual explanations associated with the chapter's STEM concepts.
 */
readerRouter.get('/chapters/:chapterId/explanations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chapterId } = req.params;
    const explanations = await readerService.getChapterExplanations(chapterId);
    res.json({ success: true, data: explanations });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/reader/explain
 * Resolves an age-appropriate contextual explanation for selected text or query.
 */
readerRouter.post('/explain', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { selectedText, chapterId, documentId, grade, medium } = req.body;
    const explanation = await readerService.resolveContextualExplanation({
      selectedText: selectedText || '',
      chapterId,
      documentId,
      grade: grade ? Number(grade) : undefined,
      medium,
    });
    if (!explanation) {
      res.status(404).json({ success: false, error: 'No matching contextual explanation found' });
      return;
    }
    res.json({ success: true, data: explanation });
  } catch (err) {
    next(err);
  }
});
