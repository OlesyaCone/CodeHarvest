import { ScrapeController } from "../controllers/scrapeController";
import { Request, Response } from "express";

describe("ScrapeController", () => {
  test("getCode method should work", async () => {
    const controller = new ScrapeController();
    
    const mockReq = {} as Request;
    const mockRes = {
      json: jest.fn()
    } as unknown as Response;

    await controller.getCode(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      html: expect.any(String),
      css: expect.any(String)
    });
  });
});