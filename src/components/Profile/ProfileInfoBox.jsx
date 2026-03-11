const ProfileInfoBox = ({ user }) => {
  return (
    <div className="bg-dark rounded-4 p-3 text-start mb-4">
      <p className="mb-2">
        <strong>Name:</strong> {user.name}
      </p>
      <p className="mb-2">
        <strong>Surname:</strong> {user.surname}
      </p>
    </div>
  )
}

export default ProfileInfoBox
