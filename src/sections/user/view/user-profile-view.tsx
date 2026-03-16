'use client';

import Card from "@mui/material/Card";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs/custom-breadcrumbs";
import { HomeContent } from "src/layouts/home";
import { paths } from 'src/routes/paths';
import { ProfileCover } from "../components/profile-cover";
import Box from '@mui/material/Box';

export function UserProfileView() {
    return (
        <HomeContent>
            
            <CustomBreadcrumbs
                heading="Perfil"
                links={[
                { name: 'Inicio', href: paths.home.root },
                { name: 'Usuario', href: "miguel ortega" },
                { name: "miguel display" },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            
            <Card sx={{ height: 290, position: 'relative' }}>
                <ProfileCover
                role="role"
                name="displayName"
                avatarUrl={undefined}
                coverUrl="coverUrl"
                />

                <Box
                sx={{
                    width: 1,
                    bottom: 0,
                    zIndex: 9,
                    px: { md: 3 },
                    display: 'flex',
                    position: 'absolute',
                    bgcolor: 'background.paper',
                    justifyContent: { xs: 'center', md: 'flex-end' },
                }}
                >
                {/* <Tabs value={selectedTab}>
                    {NAV_ITEMS.map((tab) => (
                    <Tab
                        component={RouterLink}
                        key={tab.value}
                        value={tab.value}
                        icon={tab.icon}
                        label={tab.label}
                        href={createRedirectPath(pathname, tab.value)}
                    />
                    ))}
                </Tabs> */}
                </Box>
            </Card>

            

        </HomeContent>
    );
}