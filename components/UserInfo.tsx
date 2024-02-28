"use client";
import React from 'react';
import { User } from "ayazmo-plugin-admin/types/user";
import { signOut } from "next-auth/react";
import { get } from 'ayazmo-plugin-admin/lib/http-wrapper';

type UserInfoProps = {
  user: User;
}

export default function UserInfo({ user }: UserInfoProps) {
  const handleLogout = async () => {
    await signOut();
  }

  return (
    <div className="rounded-lg border shadow-lg p-10">
      <div>
        Id : {user.id}
      </div>
      <div>
        Name : {user.name}
      </div>
      <div>
        Email : {user.email}
      </div>
      <button onClick={() => {
        console.log('on click triggered')
        get('/admin/me')
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log('Payload:', data);
          })
          .catch(error => {
            if (error.statusCode === 500) {
              console.error('There has been a problem with your fetch operation:', error);
            }
          });
      }}>
        Check backend status
      </button>
      <button className="font-medium mt-2 text-blue-600 hover:underline" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}