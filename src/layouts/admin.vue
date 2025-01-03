<template>
    <div class="w-screen h-screen overflow-hidden flex gap-4 items-center p-6">
        <Sidebar />

        <div class="w-full flex flex-col gap-6 bg-white h-full ">
            <Topbar/>
            <RouterView />
        </div>
    </div>
</template>