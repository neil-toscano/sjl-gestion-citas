import { FindOneByUserSectionQuery } from '../find-by-user.query';
import { CheckEligibilityHandler } from './check-eligibility.handler';
import { CorrectedDocumentsStatusHandler } from './corrected-documents.handler';
import { CountByStatusHandler } from './count-status.handler';
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
  FindOneByUserSectionQuery,
  CountByStatusHandler,
];
