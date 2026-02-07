export interface Drop {
  $id: string;
  name: string;
  description: string;
  launch_date: string;
  image_url: string;
  status: 'active' | 'upcoming' | 'ended';
}

export interface NotifyMe {
  email: string;
  name?: string;
  created_at: string;
}

export interface CommunityPost {
  $id: string;
  user_name: string;
  image_url: string;
  caption?: string;
  created_at: string;
}
