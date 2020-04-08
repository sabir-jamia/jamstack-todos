import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import Axios from 'axios';
import Todo from '../components/todo';
import Form from '../components/form';

export default () => {
   const [status, setStatus] = useState('loading');
   const [todos, setTodos] = useState(null);

   useEffect(() => {
      let cancelled = false;
      if (status !== 'loading') return;

      Axios('/api/get-all-todos').then(result => {
         if (cancelled === true) return;

         if (result.status !== 200) {
            console.error(`Error loading todos!`);
            console.error(result);
            return;
         }

         setTodos(result.data.todos);
         setStatus('loaded');
      });

      return () => {
         cancelled = true;
      };
   }, [status]);

   const reloadTodos = () => setStatus('loading');

   return (
      <main>
         <h1 className={styles.heading}>JAMstack todos</h1>
         <Form reloadTodos={reloadTodos} />
         {todos ? (
            <ul className={styles.todos}>
               {todos.map(todo => (
                  <li key={todo._id} className={styles.todo}>
                     <Todo todo={todo} reloadTodos={reloadTodos} />
                  </li>
               ))}
            </ul>
         ) : (
            <p className={styles.loading}>loading todos...</p>
         )}
      </main>
   );
};
