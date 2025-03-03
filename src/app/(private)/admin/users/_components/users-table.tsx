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
        if (record.isActive) {
          return "Active";
        }
        return "Inactive";
      },
    },
    {
      title: "Is Admin",
      dataIndex: "isAdmin",
      render(isAdmin: boolean) {
        if (isAdmin) {
          return "Yes";
        }
        return "No";
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: User) => (
        <div className="flex gap-5">
          <Button
            size="small"
            onClick={() =>
              handleToggleAdmin(record.id, record.isAdmin)
            }
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
    <div>
      <Table dataSource={users} columns={columns} />
    </div>
  );
}

export default UsersTable;
