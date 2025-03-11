import { CheckEligibilityHandler } from './check-eligibility.handler';
import { CheackStatusHandler } from './checkStatus.query';
import { CorrectedDocumentsStatusHandler } from './corrected-documents.handler';
import { CountByStatusHandler } from './count-status.handler';
import { FindOneByIdHandler } from './find-by-id.handler';
import { FindOneByUserSectionHandler } from './find-by-user.handler';
import { ListAllCompletedStatusHandler } from './list-all-completed-status.handler';
import { ListCompletedStatusHandler } from './list-completed-status.handler';
import { NextUserCorrectedDocumentsHandler } from './next-corrected.handler';
import { NextUserForReviewHandler } from './next-user-review.handler';
import { ObservedDocumentsHandler } from './observed-documents.handler';
import { UnresolvedDocumentsHandler } from './unresolved-documents.handler';

export const QueryHandlers = [
  ListCompletedStatusHandler,
  NextUserForReviewHandler,
  CorrectedDocumentsStatusHandler,
  UnresolvedDocumentsHandler,
  ObservedDocumentsHandler,
  CheckEligibilityHandler,
  NextUserCorrectedDocumentsHandler,
  FindOneByUserSectionHandler,
  CountByStatusHandler,
  CheackStatusHandler,
  ListAllCompletedStatusHandler,
  FindOneByIdHandler,
];
