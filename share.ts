export class shareData {
  public static parameter: { [key: string]: any } = {};
  // static parameter: any;
  public static here: any = null;
  public static err: any = null;
  //   public static parameter: any;
 
  public static set(key: string, value: any) {
    this.parameter[key] = value;
  }
  public static get<T = any>(key: string): Promise<Awaited<T>> {
	return this.parameter[key];
  }
  public static pushTo(key: string, value: string) {
	if (!Array.isArray(this.parameter[key])) {
  	this.parameter[key] = [];
	}
    this.parameter[key].push(value);
  }
  public static sentTo(params: any) {
	shareData.here = params;
  }
  public static receive(): Promise<any> {
	return shareData.here;
  }
  public static sentError(error: any) {
	shareData.err = error;
  }
  public static receiveError(): Promise<any> {
	return shareData.err;
  }
}
