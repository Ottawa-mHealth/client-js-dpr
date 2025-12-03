export default class Storage
{
  /**
   * Gets the value at `key`. Returns a promise that will be resolved
   * with that value (or undefined for missing keys).
   */
  async get(key: string): Promise<any>
  {
        const value = localStorage.values[key];
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
        localStorage.setValue(key, JSON.stringify(value));
    return value;
  }

  /**
   * Deletes the value at `key`. Returns a promise that will be resolved
   * with true if the key was deleted or with false if it was not (eg. if
   * did not exist).
   */
  async unset(key: string): Promise<boolean>
  {
    if (await this.get(key)) {
      localStorage.setValue(key, null);
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
