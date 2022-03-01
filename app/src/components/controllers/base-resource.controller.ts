export default abstract class BaseResourceController {
  public one(payload: Record<string, any>): Record<string, any> {
    return {
      data: payload,
      _links: [
        {
          rel: 'self',
          href: `/${this.getResourceName().toLowerCase()}/${payload.uuid}`,
        },
      ],
    };
  }

  protected abstract getResourceName(): string;
}
