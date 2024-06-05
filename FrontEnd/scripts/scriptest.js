let headers = { ...headers1 };

const token = {
  Authorization: `Bearer ${localStorage.getItem('authToken')}`,
};

if ((method1 === 'POST' || method1 === 'DELETE') && endUrl !== 'users/login/') {
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    headers = token;
  }
}

if (endUrl !== 'users/login/') {
  headers = {
    'Content-Type': 'application/json',
  };
}
