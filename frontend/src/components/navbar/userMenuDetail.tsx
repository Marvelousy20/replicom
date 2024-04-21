import { Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import Image from "next/image";
import { IoReorderThreeOutline } from "react-icons/io5";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const UserMenuDetail = () => {
  const router = useRouter();
  const onClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "1":
        break;
      case "2":
        router.push("/prediction");
        break;
      case "3":
        router.push("/profile");
        break;
      case "4":
        localStorage.removeItem("userData");
        signOut();
        break;
      default:
        break;
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "Prediction",
      key: "2",
    },
    {
      type: "divider",
    },
    {
      label: "Profile",
      key: "3",
    },
    {
      type: "divider",
    },
    {
      label: "Sign Out",
      key: "4",
    },
  ];

  const AvatarUrl = localStorage.getItem("userData");

  return (
    <Dropdown menu={{ items, onClick }} overlayStyle={{ width: "150px" }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <div className="rounded-lg flex gap-x-[4px] items-center border-w-[100px] px-[20px] py-[3px]  hover:cursor-pointer hover:opacity-60">
            {/* <IoReorderThreeOutline className="w-[20px] h-[20px] text-gray-500" /> */}
            <Image src="/img/user.svg" width={30} height={30} alt="user" />
          </div>
        </Space>
      </a>
    </Dropdown>
  );
};

export default UserMenuDetail;
