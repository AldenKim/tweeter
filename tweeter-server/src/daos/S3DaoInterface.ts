export interface S3DaoInterface {
  putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
}
