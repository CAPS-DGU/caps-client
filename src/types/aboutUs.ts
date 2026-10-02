export type Member = {
  name: string;
  position: string;
  img?: string;
  isLeader?: boolean;
};

export type Department = {
  tab: string;
  members: Member[];
};

export type Executive = {
  role: string;
  name: string;
  position: string;
  img?: string;
};

