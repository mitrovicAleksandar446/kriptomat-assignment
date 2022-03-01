import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';

export default abstract class BaseEntity {
  public fill(payload: Record<string, any>): void {
    for (const propertyName of Object.getOwnPropertyNames(payload)) {
      const propertySetterMethodName = this.generateSetterName(propertyName);

      if (
        !this[propertySetterMethodName] ||
        typeof this[propertySetterMethodName] !== 'function'
      )
        throw new RuntimeException('Property not whitelisted for update');

      this[propertySetterMethodName].call(this, payload[propertyName]);
    }
  }

  protected generateSetterName(propertyName: string) {
    return `set${propertyName.charAt(0).toUpperCase() + propertyName.slice(1)}`;
  }
}
