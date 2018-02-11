import 'jasmine';
import {SaveMessageFunction} from './save-message.function';
import {ApiErrorCode} from '../models/api-error.model';
import createSpy = jasmine.createSpy;
import {Message} from '../models/shared/message.model';

class MockResponse {
  resultStatus: number = 200;
  resultData?: any;
  isSent: Promise<any>;
  isSentResolver: () => void;
  
  constructor() {
    this.isSent = new Promise((resolve => {
      this.isSentResolver = resolve;
    }));
  }

  status(code: number): MockResponse {
    this.resultStatus = code;
    return this;
  }

  send(data: any): MockResponse {
    this.resultData = data;
    this.isSentResolver();
    return this;
  }
}

describe('SaveMessageFunction', () => {
  beforeEach(() => {
  });

  it('should init', () => {
    const func = new SaveMessageFunction({} as any);
  });

  it('should validate message', async () => {
    const func = new SaveMessageFunction({} as any);

    const req = {
      body: {},
    };
    const res = new MockResponse();
    func.handleRequest(req as any, res as any);
    await res.isSent;

    expect(res.resultStatus).toBe(400);
    expect(res.resultData).toBeDefined();
    expect(res.resultData.success).toBe(false);
    expect(res.resultData.errorCode).toBe(ApiErrorCode.MESSAGE_WRONG_FORMAT as any);
  });

  it('should validate message 2', async () => {
    const func = new SaveMessageFunction({} as any);

    const req = {
      body: {
        message: ''
      },
    };
    const res = new MockResponse();
    func.handleRequest(req as any, res as any);
    await res.isSent;

    expect(res.resultStatus).toBe(400);
    expect(res.resultData).toBeDefined();
    expect(res.resultData.success).toBe(false);
    expect(res.resultData.errorCode).toBe(ApiErrorCode.MESSAGE_WRONG_FORMAT as any);
  });

  it('should validate message 3', async () => {
    const messageService = {
      addMessage: createSpy('addMessage').and.returnValue(Promise.resolve({
        id: '1',
        message: 'test',
        createdTimestamp: Date.now()
      } as Message))
    };
    const func = new SaveMessageFunction(messageService as any);

    const req = {
      body: {
        message: 'test'
      },
    };
    const res = new MockResponse();
    func.handleRequest(req as any, res as any);
    await res.isSent;

    expect(messageService.addMessage).toHaveBeenCalled();
    expect(res.resultStatus).toBe(200);
    expect(res.resultData).toBeDefined();
    expect(res.resultData.success).toBe(true);
  });

  it('should save message', async () => {
    const messageService = {
      addMessage: createSpy('addMessage', (text: any) => ({message: text})).and.callThrough()
    };
    const func = new SaveMessageFunction(messageService as any);

    const req = {
      body: {
        message: 'test'
      },
    };
    const res = new MockResponse();
    func.handleRequest(req as any, res as any);
    await res.isSent;

    expect(res.resultStatus).toBe(200);
    expect(res.resultData).toBeDefined();
    expect(res.resultData.success).toBe(true);
    expect(res.resultData.data.createdMessage.message).toBe(req.body.message);
    expect(messageService.addMessage).toHaveBeenCalled();
    expect(messageService.addMessage).toHaveBeenCalledWith(req.body.message);
  });
});