export async function getServerSideProps() {
  const res = await fetch('http://127.0.0.1:8000/users/');
  const data = await res.json();
  return (
    <div>
        <h1>user list</h1>
        <ul>
            {data.map ((user)=>(
                <li>{user.name}</li>
            ))}
        </ul>
    </div>
  );
}
