import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes, deleteNote } from '../../services/noteService';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import css from './App.module.css';

function App() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 12;

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, perPage, search }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
  };

  const handleDeleteNote = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            forcePage={page - 1}
            onPageChange={handlePageChange}
          />
        )}

        <button
          className={css.button}
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <p>Loading notes...</p>}
        {isError && <p>Error loading notes. Please check your token or connection.</p>}

        {data && <NoteList notes={data.notes} onDelete={handleDeleteNote} />}

        {data && data.notes.length === 0 && !isLoading && <p>No notes found.</p>}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

export default App;