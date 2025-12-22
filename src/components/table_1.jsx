import {
  Breadcrumb,
  Button,
  Checkbox,
  Label,
  Modal,
  Table,
  TextInput,
} from "flowbite-react";
import React from "react";
import { useState } from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiCog,
  HiDocumentDownload,
  HiDotsVertical,
  HiExclamationCircle,
  HiHome,
  HiOutlineExclamationCircle,
  HiOutlinePencilAlt,
  HiPlus,
  HiTrash,
} from "react-icons/hi";
import NavbarSidebarLayout from "../views/Admin/layouts/NavbarSidebar";



const AllUsersTable = function () {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>
          <Label htmlFor="select-all" className="sr-only">
            Select all
          </Label>
          <Checkbox id="select-all" name="select-all" />
        </Table.HeadCell>
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Position</Table.HeadCell>
        <Table.HeadCell>Country</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell>Actions</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <Checkbox aria-describedby="checkbox-1" id="checkbox-1" />
              <label htmlFor="checkbox-1" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/neil-sims.png"
              alt="Neil Sims avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Neil Sims
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                neil.sims@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Front-end developer
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            United States
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
              Active
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-2"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-2" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/roberta-casas.png"
              alt="Roberta Casas avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Roberta Casas
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                roberta.casas@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Designer
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Spain
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
              Active
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-3"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-3" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/michael-gough.png"
              alt="Michael Gough avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Michael Gough
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                michael.gough@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            React developer
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            United Kingdom
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
              Active
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-4"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-4" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/jese-leos.png"
              alt="Jese Leos avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Jese Leos
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                jese.leos@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Marketing
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            United States
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
              Active
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-5"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-5" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/bonnie-green.png"
              alt="Bonnie Green avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Bonnie Green
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                bonnie.green@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            UI/UX Engineer
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            AusTable.Rowalia
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-red-500"></div>{" "}
              Offline
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-6"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-6" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/thomas-lean.png"
              alt="Thomas Lean avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Thomas Lean
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                thomas.lean@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Vue developer
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Germany
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
              Active
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-7"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-7" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/helene-engels.png"
              alt="Helene Engels avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Helene Engels
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                helene.engels@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Product owner
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Canada
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
              Active
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-8"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-8" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/lana-byrd.png"
              alt="Lana Byrd avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Lana Byrd
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                lana.byrd@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Designer
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            United States
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
              Active
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-9"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-9" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/leslie-livingston.png"
              alt="Leslie Livingston avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Leslie Livingston
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                leslie.livingston@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Web developer
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            France
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-red-500"></div>{" "}
              Offline
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-10"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-10" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/robert-brown.png"
              alt="Robert Brown avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Robert Brown
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                robert.brown@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Laravel developer
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Russia
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
              Active
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-11"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-11" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/neil-sims.png"
              alt="Neil Sims avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Neil Sims
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                neil.sims@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Front-end developer
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            United States
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
              Active
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-12"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-12" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/roberta-casas.png"
              alt="Roberta Casas avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Roberta Casas
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                roberta.casas@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Designer
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Spain
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
              Active
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-13"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-13" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/michael-gough.png"
              alt="Michael Gough avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Michael Gough
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                michael.gough@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            React developer
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            United Kingdom
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
              Active
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-14"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-14" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/jese-leos.png"
              alt="Jese Leos avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Jese Leos
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                jese.leos@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Marketing
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            United States
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
              Active
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-15"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-15" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/bonnie-green.png"
              alt="Bonnie Green avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Bonnie Green
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                bonnie.green@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            UI/UX Engineer
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            AusTable.Rowalia
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-red-500"></div>{" "}
              Offline
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>

        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-16"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-16" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/thomas-lean.png"
              alt="Thomas Lean avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Thomas Lean
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                thomas.lean@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Vue developer
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Germany
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
              Active
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>

        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-17"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-17" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/helene-engels.png"
              alt="Helene Engels avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Helene Engels
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                helene.engels@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Product owner
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Canada
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
              Active
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-18"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-18" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/lana-byrd.png"
              alt="Lana Byrd avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Lana Byrd
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                lana.byrd@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Designer
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            United States
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
              Active
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-19"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-19" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/leslie-livingston.png"
              alt="Leslie Livingston avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Leslie Livingston
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                leslie.livingston@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Web developer
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            France
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-red-500"></div>{" "}
              Offline
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <div className="flex items-center">
              <input
                id="checkbox-20"
                aria-describedby="checkbox-1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label htmlFor="checkbox-20" className="sr-only">
                checkbox
              </label>
            </div>
          </Table.Cell>
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="/images/users/robert-brown.png"
              alt="Robert Brown avatar"
            />
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                Robert Brown
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                robert.brown@flowbite.com
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Laravel developer
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Russia
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
              Active
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <EditUserModal />
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default AllUsersTable;