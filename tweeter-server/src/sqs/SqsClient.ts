import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export class SqsClient {
  private sqsClient = new SQSClient();

  private sqs_url: string;

  public constructor(sqs_url: string) {
    this.sqs_url = sqs_url;
  }

  public async sendMessage(message: string): Promise<void> {
    const params = {
      DelaySeconds: 10,
      MessageBody: message,
      QueueUrl: this.sqs_url,
    };

    try {
      const data = await this.sqsClient.send(new SendMessageCommand(params));
      console.log("Success, message sent. MessageID:", data.MessageId);
    } catch (err) {
      throw err;
    }
  }
}
