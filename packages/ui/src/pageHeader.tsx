import { ArrowLeftIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import Button from "./button";
import { HamburgerMenu } from "./hamburgerMenu";

const BlockiesSvg = dynamic<{ address: string; size: number; scale: number }>(
	() => import("blockies-react-svg"),
	{ ssr: false },
);

interface PageHeaderProps {
	title: string | React.ReactNode;
	userAddress?: string;
	onLogout?: () => void;
	hideCart?: boolean;
	showBackButton?: boolean;
	onBackClick?: () => void;
	showBlockie?: boolean;
	rightActions?: React.ReactNode;
	showCart?: boolean;
	cartItemsCount?: number;
	onConnect?: () => void;
	profileOptions?: React.ReactNode;
}

function PageHeader({
	title,
	userAddress,
	onLogout,
	hideCart = false,
	showBackButton = false,
	onBackClick,
	showBlockie = true,
	rightActions,
	showCart = true,
	cartItemsCount,
	onConnect,
	profileOptions,
}: PageHeaderProps) {
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
	const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const { t } = useTranslation();
	const router = useRouter();

	const toggleProfileMenu = () => {
		setIsProfileMenuOpen((prevState: boolean) => !prevState);
	};

	const toggleHamburgerMenu = () => {
		setIsHamburgerMenuOpen((prevState: boolean) => !prevState);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Enter" || event.key === " ") {
			toggleProfileMenu();
		}
	};

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsProfileMenuOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="w-full max-w-full md:max-w-7xl px-4 h-20 py-3 bg-white flex justify-between items-center mx-auto space-x-4 fixed top-0 left-0 right-0 z-50 shadow-sm">
			<div className="flex items-center space-x-2">
				{showBackButton && (
					<button
						onClick={onBackClick}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
						type="button"
						aria-label="Go back"
					>
						<ArrowLeftIcon className="w-6 h-6" />
					</button>
				)}
			</div>
			<div className="flex-grow text-center md:text-left">
				<Link
					href="/marketplace"
					className="hover:opacity-80 transition-opacity inline-flex items-center gap-2"
				>
					<Image
						src="/images/logo.png"
						alt="CofiBlocks Logo"
						width={40}
						height={64}
						className="w-10 h-16"
					/>
				</Link>
			</div>
			<div className="flex items-center space-x-4">
				{rightActions}
				{!userAddress && onConnect && (
					<Button
						onClick={onConnect}
						variant="primary"
						size="sm"
						className="px-4"
					>
						{t("Connect")}
					</Button>
				)}
				{showCart && (
					<button
						type="button"
						onClick={() => router.push("/shopping-cart")}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
						aria-label="Shopping cart"
					>
						<ShoppingCartIcon className="w-6 h-6" />
						{cartItemsCount && cartItemsCount > 0 ? (
							<span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
								{cartItemsCount}
							</span>
						) : null}
					</button>
				)}
				{userAddress && (
					<div className="flex items-center space-x-4">
						{profileOptions && (
							<HamburgerMenu
								isOpen={isHamburgerMenuOpen}
								onToggle={toggleHamburgerMenu}
							>
								{profileOptions}
							</HamburgerMenu>
						)}
						<div className="relative" ref={menuRef}>
							<div
								className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
								onClick={toggleProfileMenu}
								onKeyDown={handleKeyDown}
								role="button"
								tabIndex={0}
								aria-label="Open user menu"
								aria-expanded={isProfileMenuOpen}
								aria-haspopup="true"
							>
								{showBlockie && (
									<div className="rounded-full overflow-hidden relative w-10 h-10 ring-2 ring-surface-primary-default">
										<BlockiesSvg address={userAddress} size={10} scale={4} />
									</div>
								)}
							</div>
							{isProfileMenuOpen && (
								<div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
									<div
										className="py-1"
										role="menu"
										aria-orientation="vertical"
										aria-labelledby="options-menu"
									>
										<Link
											href="/user-profile"
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
											role="menuitem"
										>
											{t("Profile")}
										</Link>
										<button
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
											onClick={onLogout}
											role="menuitem"
											type="button"
										>
											{t("disconnect")}
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default PageHeader;
