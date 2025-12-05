export interface InvitationContent {
  headline: string;
  body: string;
  signature: string;
}

export interface InvitationFormData {
  hostName: string;
  eventName: string;
  date: string;
  time: string;
  location: string;
  details: string;
}

export enum EnvelopeState {
  CLOSED = 'CLOSED',
  OPENING = 'OPENING',
  OPEN = 'OPEN'
}