export class HasOpenAppointmentQuery {
  constructor(
    public readonly sectionId: string,
    public readonly userId: string,
  ) {}
}
