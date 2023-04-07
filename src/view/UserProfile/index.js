import CustomBreadcrumb from "../../components/CustomBreadcrumb";

const itemslist=[{ label: 'User Profile', url: '/userprofile'  }, ];
const UserProfile = () => {
  return (
    <div className="w-11 pt-3 m-auto"><CustomBreadcrumb itemslist={itemslist}/>
    </div>
  )
}

export default UserProfile