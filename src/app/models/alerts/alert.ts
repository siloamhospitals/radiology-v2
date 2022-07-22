export class Alert {
    type: AlertType;
    typeName?: string;
    additionalClassName?: string;
    message: string;
    destination: string;
    duration?: number;
    keepAfterRouteChange: boolean;
  }

export enum AlertType {
    Success,
    Error,
    Info,
    Warning,
}
