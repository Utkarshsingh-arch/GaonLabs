import { Router, Request, Response, NextFunction } from 'express';
import { curriculumService } from './curriculum.service';
import { CurriculumStatus } from '@gaonlab/shared-types';

export const curriculumRouter = Router();

/**
 * GET /api/v1/curriculum/boards
 * List all registered Education Boards (e.g. CBSE, KARNATAKA_STATE_BOARD).
 */
curriculumRouter.get('/boards', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const boards = await curriculumService.getBoards();
    res.status(200).json({
      success: true,
      data: boards,
      count: boards.length,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/curriculum/boards/:boardId/grades
 * List all available grades for a specific education board.
 */
curriculumRouter.get('/boards/:boardId/grades', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { boardId } = req.params;
    const grades = await curriculumService.getGradesForBoard(boardId);
    res.status(200).json({
      success: true,
      boardId,
      data: grades,
      count: grades.length,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/curriculum/grades/:gradeId/subjects
 * List all available subjects for a specific grade/level (e.g. GRADE_6, GRADE_7, GRADE_8).
 * Optional query parameter: ?boardId=CBSE
 */
curriculumRouter.get('/grades/:gradeId/subjects', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gradeId } = req.params;
    const boardId = req.query.boardId as string | undefined;
    const subjects = await curriculumService.getSubjectsForGrade(gradeId, boardId);
    res.status(200).json({
      success: true,
      gradeId,
      boardId: boardId || null,
      data: subjects,
      count: subjects.length,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/curriculum/catalogue
 * Query the curriculum catalogue with optional filters:
 * ?boardId=CBSE&grade=6&levelId=GRADE_6&subjectId=SCIENCE&academicYear=2026-2027&medium=en&status=VERIFIED
 */
curriculumRouter.get('/catalogue', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = {
      boardId: req.query.boardId as string | undefined,
      grade: req.query.grade ? parseInt(req.query.grade as string, 10) : undefined,
      levelId: req.query.levelId as string | undefined,
      subjectId: req.query.subjectId as string | undefined,
      academicYear: req.query.academicYear as string | undefined,
      medium: req.query.medium as string | undefined,
      status: req.query.status as CurriculumStatus | undefined,
    };

    const catalogue = await curriculumService.getCatalogue(filter);
    res.status(200).json({
      success: true,
      filter,
      data: catalogue,
      count: catalogue.length,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/curriculum/textbooks/:textbookId
 * Retrieve detailed textbook information including publisher and available editions.
 */
curriculumRouter.get('/textbooks/:textbookId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { textbookId } = req.params;
    const textbook = await curriculumService.getTextbookById(textbookId);
    res.status(200).json({
      success: true,
      data: textbook,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/curriculum/editions/:editionId/chapters
 * Retrieve the chapter list and learning outcomes for a specific textbook edition.
 */
curriculumRouter.get('/editions/:editionId/chapters', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { editionId } = req.params;
    const chapters = await curriculumService.getChaptersByEditionId(editionId);
    res.status(200).json({
      success: true,
      editionId,
      data: chapters,
      count: chapters.length,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/curriculum/resolve/:learnerId
 * Resolve complete active curriculum tree for a specific enrolled student.
 */
curriculumRouter.get('/resolve/:learnerId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { learnerId } = req.params;
    const resolved = await curriculumService.resolveStudentCurriculum(learnerId);
    res.status(200).json({
      success: true,
      data: resolved,
    });
  } catch (err) {
    next(err);
  }
});
