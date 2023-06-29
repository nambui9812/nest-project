interface Resp {
  message: string;
  data?: any;
}

export function GetResponse({ message, data }: Resp) {
  return {
    message,
    data
  };
}
