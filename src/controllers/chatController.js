import botService from '../services/botService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/index.js';

export const chat = asyncHandler(async (req, res) => {
  const { message, userId = 'api-user' } = req.body;

  try {
    const { reply, usage } = await botService.handleMessage(userId, message);
    sendSuccess(res, { reply, usage }, 'OK', HTTP_STATUS.OK);
  } catch (err) {
    sendError(res, err.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
});

export const clearHistory = asyncHandler(async (req, res) => {
  const { userId = 'api-user' } = req.body;
  botService.clearHistory(userId);
  sendSuccess(res, null, 'History cleared', HTTP_STATUS.OK);
});
