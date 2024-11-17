export class RemoveAppointmentCommand {
  constructor(
    public readonly sectionId: string,
    public readonly userId: string,
  ) {}
}
