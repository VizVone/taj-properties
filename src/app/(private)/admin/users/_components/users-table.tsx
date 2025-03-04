// "use client";
// import { User } from "@prisma/client";
// import { Button, Table, message } from "antd";
// import dayjs from "dayjs";
// import React from "react";
// import { ToggleUserAdminStatus, DeleteUser } from "@/actions/users";

// function UsersTable({ users }: { users: User[] }) {
//   const [loading, setLoading] = React.useState<boolean>(false);

//   const handleToggleAdmin = async (id: string, isAdmin: boolean) => {
//     try {
//       setLoading(true);
//       const newRole = isAdmin ? "user" : "admin";
//       const response = await ToggleUserAdminStatus(id, newRole);
//       if (response.error) throw new Error(response.error);
//       message.success(response.message);
//     } catch (error: any) {
//       message.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteUser = async (id: string) => {
//     try {
//       setLoading(true);
//       const response = await DeleteUser(id);
//       if (response.error) throw new Error(response.error);
//       message.success(response.message);
//     } catch (error: any) {
//       message.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const columns = [
//     {
//       title: "Profile Pic",
//       dataIndex: "profilePic",
//       render(profilePic: string) {
//         return (
//           <img
//             src={profilePic}
//             alt="Profile Pic"
//             width="35"
//             className="rounded-full"
//           />
//         );
//       },
//     },
//     {
//       title: "Name",
//       dataIndex: "username",
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//     },
//     {
//       title: "Registered On",
//       dataIndex: "createdAt",
//       render(createdAt: string) {
//         return dayjs(createdAt).format("MMM DD YYYY HH:mm A");
//       },
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render(status: string, record: User) {
//         if (record.isActive) {
//           return "Active";
//         }
//         return "Inactive";
//       },
//     },
//     {
//       title: "Is Admin",
//       dataIndex: "isAdmin",
//       render(isAdmin: boolean) {
//         if (isAdmin) {
//           return "Yes";
//         }
//         return "No";
//       },
//     },
//     {
//       title: "Actions",
//       dataIndex: "actions",
//       render: (_: any, record: User) => (
//         <div className="flex gap-5">
//           <Button
//             size="small"
//             onClick={() =>
//               handleToggleAdmin(record.id, record.isAdmin)
//             }
//             loading={loading}
//           >
//             {record.isAdmin ? "Remove Admin" : "Make Admin"}
//           </Button>
//           <Button
//             size="small"
//             danger
//             onClick={() => handleDeleteUser(record.id)}
//             loading={loading}
//           >
//             Remove User
//           </Button>
//         </div>
//       ),
//     },
//   ];
//   return (
//     <div>
//       <Table dataSource={users} columns={columns} />
//     </div>
//   );
// }

// export default UsersTable;

"use client";
import { User } from "@prisma/client";
import { Button, Table, message } from "antd";
import dayjs from "dayjs";
import React from "react";
import { ToggleUserAdminStatus, DeleteUser } from "@/actions/users";

function UsersTable({ users }: { users: User[] }) {
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleToggleAdmin = async (id: string, isAdmin: boolean) => {
    try {
      setLoading(true);
      const newRole = isAdmin ? "user" : "admin";
      const response = await ToggleUserAdminStatus(id, newRole);
      if (response.error) throw new Error(response.error);
      message.success(response.message);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      setLoading(true);
      const response = await DeleteUser(id);
      if (response.error) throw new Error(response.error);
      message.success(response.message);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const columns = [
    {
      title: "Profile Pic",
      dataIndex: "profilePic",
      render(profilePic: string) {
        return (
          <img
            src={profilePic}
            alt="Profile Pic"
            width="35"
            className="rounded-full"
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Registered On",
      dataIndex: "createdAt",
      render(createdAt: string) {
        return dayjs(createdAt).format("MMM DD YYYY HH:mm A");
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render(status: string, record: User) {
        return record.isActive ? "Active" : "Inactive";
      },
    },
    {
      title: "Is Admin",
      dataIndex: "isAdmin",
      render(isAdmin: boolean) {
        return isAdmin ? "Yes" : "No";
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: User) => (
        <div className="flex gap-5">
          <Button
            size="small"
            onClick={() => handleToggleAdmin(record.id, record.isAdmin)}
            loading={loading}
          >
            {record.isAdmin ? "Remove Admin" : "Make Admin"}
          </Button>
          <Button
            size="small"
            danger
            onClick={() => handleDeleteUser(record.id)}
            loading={loading}
          >
            Remove User
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      {/* Table for large screens */}
      <div className="hidden md:block">
        <Table dataSource={users} columns={columns} pagination={{ pageSize: 5 }} />
      </div>
      
      {/* Card layout for small screens */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div key={user.id} className="border p-4 rounded-lg shadow-md bg-white">
            <div className="flex items-center gap-4">
              <img src={user.profilePic} alt="Profile Pic" className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-2">Registered: {dayjs(user.createdAt).format("MMM DD YYYY HH:mm A")}</p>
            <p className="text-gray-600 text-sm">Status: {user.isActive ? "Active" : "Inactive"}</p>
            <p className="text-gray-600 text-sm">Admin: {user.isAdmin ? "Yes" : "No"}</p>
            <div className="flex gap-3 mt-3">
              <Button
                size="small"
                onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                loading={loading}
              >
                {user.isAdmin ? "Remove Admin" : "Make Admin"}
              </Button>
              <Button
                size="small"
                danger
                onClick={() => handleDeleteUser(user.id)}
                loading={loading}
              >
                Remove User
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersTable;
