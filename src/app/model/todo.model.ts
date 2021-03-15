export interface Todo {
  id?: number;
  title: string;
  task_list: number;
  created_by?: string;
  priority?: number;
  completed?: boolean;
  completed_date?: string;
  created_date?: string;
  updated_date?: string;
}
