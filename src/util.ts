export interface GameNode {
  id: string;
  address: string;
}

export const parseNodeAddr = (addr: string) : GameNode => {
  const parts = addr.split("/");
  const [id, address] = parts;

  return {
    id,
    address
  }
}
