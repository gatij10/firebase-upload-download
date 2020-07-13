import React, { useEffect } from 'react';
import { app } from './base';

import './App.css';

const db = app.firestore();

function App() {
  const [fileUrl, setFileUrl] = React.useState(null);
  //const [users, setUsers] = React.useState([]);
  const [document, setDoc] = React.useState([]);
  const [file, setFileName] = React.useState('');

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    const storageRef = app.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    setFileUrl(await fileRef.getDownloadURL());
    console.log(fileUrl);
    // storageRef.listAll().then((res) => {
    //   res.items.forEach((item) => {
    //     console.log(item.name);
    //   });
    // });
  };

  const onSubmitFile = (e) => {
    e.preventDefault();
    const fileName = e.target.filename.value;
    if (!fileName) {
      return;
    }
    setFileName(fileName);

    db.collection('users').doc().set({
      name: fileName,
      avatar: fileUrl,
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      db.collection('users')
        .get()
        .then((snapshot) => {
          const documents = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            documents.push(data);
          });
          setDoc(documents);
          console.log(documents);
        })
        .catch((error) => console.log(error));
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <form onSubmit={onSubmitFile}>
        <input type='file' onChange={onFileChange}></input>
        <input
          type='text'
          name='filename'
          placeholder='Enter file name...'
        ></input>
        <button>Submit</button>
      </form>
      {document.map((docu) => {
        return (
          <div>
            <a href={docu.avatar} key={docu.id} download>
              {docu.name}
            </a>
          </div>
        );
      })}
    </div>
  );
}

export default App;
