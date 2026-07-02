export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
}

// Тип для створення нової нотатки (без id)
export type NewNote = Omit<Note, 'id'>;