/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user?: {
      userId: string;
      username: string;
      profilePicture?: string;
    };
    userRole?: 'ADMIN' | 'USER';
  }
}
