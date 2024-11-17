export class GetAppointmentsByWeekQuery {
  constructor(
    public readonly date: Date,
    public readonly sectionId: string,
  ) {}
}
