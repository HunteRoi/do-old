import { Badge } from "@mui/material"
import { PropsWithChildren } from "react"

const NewBadge: React.FC<PropsWithChildren> = ({ children }) => {
    return <Badge badgeContent='NEW' color='error' anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        {children}
    </Badge>;
}

export default NewBadge;
