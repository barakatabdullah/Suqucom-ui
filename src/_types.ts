export{}

declare global {

    type Admin={
        id: number
        name: string
        email: string
        is_email_verified: boolean
        active: boolean
        media: object
        roles: object[]
    }

    type Category={
        id: number
        name: string
        name_ar?: string
        name_en?: string
        slug: string
        image?: string
        active: boolean
        order?: number | null
        published: boolean
        parent_id?: number
        parent_category?: Category
    }

}