'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import Header from 'components/Header';

export default function EditPostPage() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  /**
   * Fetches the post data based on the post ID.
   * Sends a GET request to the backend API to retrieve the post details.
   */
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/posts/${id}`);
        const post = res.data;
        setTitle(post.title);
        setContent(post.content);
        setInitialDataLoaded(true);
      } catch (err) {
        setError('Failed to fetch post data because : ' + err);
      }
    };
    fetchPost();
  }, [id]);

  /**
   * Handles changes to the title input field.
   * @param e - The input change event
   */
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsDirty(true);
  };

  /**
   * Handles changes to the content textarea field.
   * @param e - The textarea change event
   */
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(true);
  };


  /**
   * Handles the form submission for editing a post.
   * Validates if the user is authenticated by checking the token.
   *
   * @param e - The form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('You must be logged in to edit a post');
      return;
    }

    try {
      await axios.put(
        `http://localhost:4000/api/posts/${id}`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push('/');
    } catch (err) {
      setError('Failed to update post because: ' + err);
    }
  };

  if (!initialDataLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="edit-post-body">
      <Header />
      <div className="container mx-auto mt-10 px-4 md:px-0">

        <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg max-w-2xl mx-auto">
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-black border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Content</label>
            <textarea
              value={content}
              onChange={handleContentChange}
              className="text-black border p-3 rounded w-full h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isDirty}
          >
            Update Blog
          </button>
        </form>
      </div>
    </div>
  );
}
