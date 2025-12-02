export default class Storage
{
  /**
   * Gets the value at `key`. Returns a promise that will be resolved
   * with that value (or undefined for missing keys).
   */
  async get(key: string): Promise<any>
  {
    const value = this.retoolVariable().value[key];
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }

  /**
   * Sets the `value` on `key` and returns a promise that will be resolved
   * with the value that was set.
   */
  async set(key: string, value: any): Promise<any>
  {
    const currentVal = await this.get(key);
    this.retoolVariable().setValue(
      JSON.stringify({ ...currentVal, [key]: value })
    );
    return value;
  }

  /**
   * Deletes the value at `key`. Returns a promise that will be resolved
   * with true if the key was deleted or with false if it was not (eg. if
   * did not exist).
   */
  async unset(key: string): Promise<boolean>
  {
    const currentVal = await this.get(key);
    if (currentVal) {
      this.retoolVariable().setValue(
        currentVal.filter((k: string) => k !== key)
      );
      return true;
    }
    return false;
  }

  retoolVariable()
  {
    // In the Retool context, global variables/plugins can be accessed via globalThis or window
    // Since variables are in scope, we can use eval or access it through the global context
    const retrieveStateVariable = (variableName: string) => {
      try {
        return eval(variableName);
      } catch (e) {
        // Fallback: try accessing via globalThis
        return (globalThis as Record<string, any>)[variableName];
      }
    };

    const variable = retrieveStateVariable("smartState");
    if (!variable)
      throw new Error(
        `Retool variable "smartState" not found. Make sure it exists in the Retool app context.`
      );
    return variable;
  }
}
