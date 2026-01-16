
const ProfileIcon = ({ className }: { className?: string }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M17 18C15.5186 16.7256 13.8139 16 12 16C10.1861 16 8.48139 16.7256 7 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="3" cy="3" r="3" transform="matrix(1 0 0 -1 9 13)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6C22 3.79086 20.2091 2 18 2Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    )
}

export default ProfileIcon
