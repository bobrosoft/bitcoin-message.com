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
    const func = new SaveMessageFunction({} as any, {} as any);
  });

  it('should validate message', async () => {
    const func = new SaveMessageFunction({} as any, {} as any);

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
    const func = new SaveMessageFunction({} as any, {} as any);

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
      } as Message)),
      getPublishedMessagesForDay: createSpy('getPublishedMessagesForDay').and.returnValue(Promise.resolve([]))
    };
    const func = new SaveMessageFunction({donations: {}} as any, messageService as any);

    const req = {
      body: {
        message: 'test'
      },
    };
    const res = new MockResponse();
    func.handleRequest(req as any, res as any);
    await res.isSent;

    expect(messageService.addMessage).toHaveBeenCalled();
    expect(res.resultData).toBeDefined();
    expect(res.resultData.errorMessage).toBeUndefined();
    expect(res.resultData.success).toBe(true);
    expect(res.resultStatus).toBe(200);
  });

  it('should save message', async () => {
    const messageService = {
      addMessage: createSpy('addMessage', (text: any) => ({message: text})).and.callThrough(),
      getPublishedMessagesForDay: createSpy('getPublishedMessagesForDay').and.returnValue(Promise.resolve([]))
    };
    const func = new SaveMessageFunction({donations: {}} as any, messageService as any);

    const req = {
      body: {
        message: 'test'
      },
    };
    const res = new MockResponse();
    func.handleRequest(req as any, res as any);
    await res.isSent;

    expect(messageService.addMessage).toHaveBeenCalledWith(req.body.message);
    expect(res.resultData).toBeDefined();
    expect(res.resultData.errorMessage).toBeUndefined();
    expect(res.resultData.success).toBe(true);
    expect(res.resultStatus).toBe(200);
    expect(res.resultData.data.createdMessage.message).toBe(req.body.message);
  });

  it('should publish free message', async () => {
    const publishedMessages: Message[] = [
      {message: 'test', isPublished: true, createdTimestamp: Date.now()},
      {message: 'test', isPublished: false, createdTimestamp: Date.now()},
      {message: 'test', isPublished: false, createdTimestamp: Date.now()}
    ];
    const messageService = {
      addMessage: createSpy('addMessage', (text: any) => ({message: text})).and.callThrough(),
      getPublishedMessagesForDay: createSpy('getPublishedMessagesForDay').and.returnValue(Promise.resolve(publishedMessages)),
      publishMessageInBlockchain: createSpy('publishMessageInBlockchain', (message: any) => ({...message})).and.callThrough(),
    };
    const func = new SaveMessageFunction({donations: {free_messages_limit: '2'}} as any, messageService as any);

    const req = {
      body: {
        message: 'test'
      },
    };
    const res = new MockResponse();
    func.handleRequest(req as any, res as any);
    await res.isSent;

    expect(res.resultData).toBeDefined();
    expect(res.resultData.errorMessage).toBeUndefined();
    expect(res.resultData.success).toBe(true);
    expect(res.resultStatus).toBe(200);
    expect(messageService.addMessage).toHaveBeenCalledWith(req.body.message);
    expect(messageService.publishMessageInBlockchain).toHaveBeenCalled();
  });

  it('should not publish free message because limit exceeded', async () => {
    const publishedMessages: Message[] = [
      {message: 'test', isPublished: true, createdTimestamp: Date.now()},
      {message: 'test', isPublished: true, createdTimestamp: Date.now()},
      {message: 'test', isPublished: false, createdTimestamp: Date.now()}
    ];
    const messageService = {
      addMessage: createSpy('addMessage', (text: any) => ({message: text})).and.callThrough(),
      getPublishedMessagesForDay: createSpy('getPublishedMessagesForDay').and.returnValue(Promise.resolve(publishedMessages)),
      publishMessageInBlockchain: createSpy('publishMessageInBlockchain', (message: any) => ({...message})).and.callThrough(),
    };
    const func = new SaveMessageFunction({donations: {free_messages_limit: '2'}} as any, messageService as any);

    const req = {
      body: {
        message: 'test'
      },
    };
    const res = new MockResponse();
    func.handleRequest(req as any, res as any);
    await res.isSent;

    expect(res.resultData).toBeDefined();
    expect(res.resultData.errorMessage).toBeUndefined();
    expect(res.resultData.success).toBe(true);
    expect(res.resultStatus).toBe(200);
    expect(messageService.addMessage).toHaveBeenCalledWith(req.body.message);
    expect(messageService.publishMessageInBlockchain).not.toHaveBeenCalled();
  });

  it('should not publish free message because that IP already published one', async () => {
    const publishedMessages: Message[] = [
      {message: 'test', isPublished: true, createdTimestamp: Date.now(), clientIp: '6.7.8.9'},
      {message: 'test', isPublished: false, createdTimestamp: Date.now()}
    ];
    const messageService = {
      addMessage: createSpy('addMessage', (text: any) => ({message: text})).and.callThrough(),
      getPublishedMessagesForDay: createSpy('getPublishedMessagesForDay').and.returnValue(Promise.resolve(publishedMessages)),
      publishMessageInBlockchain: createSpy('publishMessageInBlockchain', (message: any) => ({...message})).and.callThrough(),
    };
    const func = new SaveMessageFunction({donations: {free_messages_limit: '2'}} as any, messageService as any);

    const req = {
      headers: {'x-forwarded-for': '6.7.8.9'},
      body: {
        message: 'test'
      },
    };
    const res = new MockResponse();
    func.handleRequest(req as any, res as any);
    await res.isSent;

    expect(res.resultData).toBeDefined();
    expect(res.resultData.errorMessage).toBeUndefined();
    expect(res.resultData.success).toBe(true);
    expect(res.resultStatus).toBe(200);
    expect(messageService.addMessage).toHaveBeenCalledWith(req.body.message);
    expect(messageService.publishMessageInBlockchain).not.toHaveBeenCalled();
  });

  it('should return IP from request', () => {
    const func = new SaveMessageFunction({} as any, {} as any);
    
    expect(func.getIpFromRequest({headers: {'x-forwarded-for': '6.7.8.9'}} as any)).toBe('6.7.8.9');
    expect(func.getIpFromRequest({headers: {'x-forwarded-for': '1.2.3.4, 6.7.8.9'}} as any)).toBe('6.7.8.9');
    expect(func.getIpFromRequest({headers: {'x-forwarded-for': ''}} as any)).toBeUndefined();
    expect(func.getIpFromRequest({headers: {}} as any)).toBeUndefined();
  });
});