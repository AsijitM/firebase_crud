import { useEffect, useState } from 'react';
import './App.css';
import { db } from './firebase-config';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';

function App() {
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState(0);
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, 'users');

  const createUser = async () => {
    await addDoc(usersCollectionRef, { Name: newName, age: Number(newAge) });
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    };

    getUsers();
  }, []);

  const updateUser = async (id, age) => {
    const userDoc = doc(db, 'users', id);
    const newFields = { age: age + 1 };
    await updateDoc(userDoc, newFields);
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, 'users', id);
    await deleteDoc(userDoc);
  }
  return (
    <div className="App">
      <input
        type="text"
        placeholder="Name.."
        onChange={(event) => {
          setNewName(event.target.value);
        }}
      />

      <input
        type="number"
        placeholder="Age.."
        onChange={(event) => {
          setNewAge(event.target.value);
        }}
      />

      <button onClick={createUser}>Create User</button>

      {users.map((user) => {
        return (
          <div>
            {' '}
            <h1> Name: {user.Name} </h1>
            <h1> Age: {user.age} </h1>{' '}
            <button
              onClick={() => {
                updateUser(user.id, user.age);
              }}
            >
              INCREASE AGE
            </button>
            <button
              onClick={() => {
                deleteUser(user.id);
              }}
            >
              Delete USER
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
