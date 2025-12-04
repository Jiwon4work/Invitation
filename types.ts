export interface InvitationContent {
  headline: string;
  body: string;
  signature: string;
}

export enum EnvelopeState {
  CLOSED = 'CLOSED',
  OPENING = 'OPENING',
  OPEN = 'OPEN'
}