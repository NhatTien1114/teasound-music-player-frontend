"use client";
import Link from "next/link"
import { Home } from "lucide-react"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react";

export function BreadCrumb({ item, separetor }: { item: { href: string, label: string }[], separetor: React.ReactNode }) {
    return (
        <Breadcrumb className="mb-6">
            <BreadcrumbList className="text-sm">
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/admin" className="text-grayDark hover:text-white transition-colors flex items-center gap-1.5">
                            <Home className="w-3.5 h-3.5" />
                            <span>Dashboard</span>
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {item.map((crumb, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbSeparator className="text-grayDark/50">
                            {separetor}
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            {index === item.length - 1 ? (
                                <BreadcrumbPage className="text-white font-medium">
                                    {crumb.label}
                                </BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link href={crumb.href} className="text-grayDark hover:text-white transition-colors">
                                        {crumb.label}
                                    </Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
