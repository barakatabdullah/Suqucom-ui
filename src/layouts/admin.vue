<template>
    <div class="w-screen h-screen overflow-hidden flex gap-4 items-center p-6">
        <Sidebar />

        <div class="w-full rounded-6 bg-white h-full ">
            <RouterView />
        </div>
    </div>
</template>