<template>
    <div>
        <div class="mb-6 flex flex-wrap items-center justify-center gap-4 lg:justify-end">
            <button type="button" class="btn btn-info gap-2">
                <icon-send />
                Send Invoice
            </button>

            <button type="button" class="btn btn-primary gap-2" @click="print">
                <icon-printer />

                Print
            </button>

            <button type="button" class="btn btn-success gap-2">
                <icon-download />
                Download
            </button>

            <NuxtLink to="/apps/invoice/add" class="btn btn-secondary gap-2">
                <icon-plus />
                Create
            </NuxtLink>

            <NuxtLink to="/apps/invoice/edit" class="btn btn-warning gap-2">
                <icon-edit />
                Edit
            </NuxtLink>
        </div>
        <div class="panel">
            <div class="flex flex-wrap justify-between gap-4 px-4">
                <div class="text-2xl font-semibold uppercase">Invoice</div>
                <div class="shrink-0">
                    <img src="/assets/images/logo.png" alt="" class="w-14 ltr:ml-auto rtl:mr-auto" />
                </div>
            </div>
            <div class="px-4 ltr:text-right rtl:text-left">
                <div class="mt-6 space-y-1 text-white-dark">
                    <div>13 Tetrick Road, Cypress Gardens, Florida, 33884, US</div>
                    <div>vristo@gmail.com</div>
                    <div>+1 (070) 123-4567</div>
                </div>
            </div>

            <hr class="my-6 border-[#e0e6ed] dark:border-[#1b2e4b]" />
            <div class="flex flex-col flex-wrap justify-between gap-6 lg:flex-row">
                <div class="flex-1">
                    <div class="space-y-1 text-white-dark">
                        <div>Issue For:</div>
                        <div class="font-semibold text-black dark:text-white">John Doe</div>
                        <div>405 Mulberry Rd. Mc Grady, NC, 28649</div>
                        <div>redq@company.com</div>
                        <div>(128) 666 070</div>
                    </div>
                </div>
                <div class="flex flex-col justify-between gap-6 sm:flex-row lg:w-2/3">
                    <div class="xl:1/3 sm:w-1/2 lg:w-2/5">
                        <div class="mb-2 flex w-full items-center justify-between">
                            <div class="text-white-dark">Invoice :</div>
                            <div>#8701</div>
                        </div>
                        <div class="mb-2 flex w-full items-center justify-between">
                            <div class="text-white-dark">Issue Date :</div>
                            <div>13 Sep 2022</div>
                        </div>
                        <div class="mb-2 flex w-full items-center justify-between">
                            <div class="text-white-dark">Order ID :</div>
                            <div>#OD-85794</div>
                        </div>
                        <div class="flex w-full items-center justify-between">
                            <div class="text-white-dark">Shipment ID :</div>
                            <div>#SHP-8594</div>
                        </div>
                    </div>
                    <div class="xl:1/3 sm:w-1/2 lg:w-2/5">
                        <div class="mb-2 flex w-full items-center justify-between">
                            <div class="text-white-dark">Bank Name:</div>
                            <div class="whitespace-nowrap">Bank Of America</div>
                        </div>
                        <div class="mb-2 flex w-full items-center justify-between">
                            <div class="text-white-dark">Account Number:</div>
                            <div>1234567890</div>
                        </div>
                        <div class="mb-2 flex w-full items-center justify-between">
                            <div class="text-white-dark">SWIFT Code:</div>
                            <div>S58K796</div>
                        </div>
                        <div class="mb-2 flex w-full items-center justify-between">
                            <div class="text-white-dark">IBAN:</div>
                            <div>L5698445485</div>
                        </div>
                        <div class="mb-2 flex w-full items-center justify-between">
                            <div class="text-white-dark">Country:</div>
                            <div>United States</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="table-responsive mt-6">
                <table class="table-striped">
                    <thead>
                        <tr>
                            <template v-for="item in columns" :key="item.key">
                                <th :class="[item.class]">{{ item.label }}</th>
                            </template>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="item in items" :key="item.id">
                            <tr>
                                <td>{{ item.id }}</td>
                                <td>{{ item.title }}</td>
                                <td>{{ item.quantity }}</td>
                                <td class="ltr:text-right rtl:text-left">${{ item.price }}</td>
                                <td class="ltr:text-right rtl:text-left">${{ item.amount }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
            <div class="mt-6 grid grid-cols-1 px-4 sm:grid-cols-2">
                <div></div>
                <div class="space-y-2 ltr:text-right rtl:text-left">
                    <div class="flex items-center">
                        <div class="flex-1">Subtotal</div>
                        <div class="w-[37%]">$3255</div>
                    </div>
                    <div class="flex items-center">
                        <div class="flex-1">Tax</div>
                        <div class="w-[37%]">$700</div>
                    </div>
                    <div class="flex items-center">
                        <div class="flex-1">Shipping Rate</div>
                        <div class="w-[37%]">$0</div>
                    </div>
                    <div class="flex items-center">
                        <div class="flex-1">Discount</div>
                        <div class="w-[37%]">$10</div>
                    </div>
                    <div class="flex items-center text-lg font-semibold">
                        <div class="flex-1">Grand Total</div>
                        <div class="w-[37%]">$3945</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ref } from 'vue';
    useHead({ title: 'Invoice Preview' });

    const items = ref([
        {
            id: 1,
            title: 'Calendar App Customization',
            quantity: 1,
            price: '120',
            amount: '120',
        },
        {
            id: 2,
            title: 'Chat App Customization',
            quantity: 1,
            price: '230',
            amount: '230',
        },
        {
            id: 3,
            title: 'Laravel Integration',
            quantity: 1,
            price: '405',
            amount: '405',
        },
        {
            id: 4,
            title: 'Backend UI Design',
            quantity: 1,
            price: '2500',
            amount: '2500',
        },
    ]);
    const columns = ref([
        {
            key: 'id',
            label: 'S.NO',
        },
        {
            key: 'title',
            label: 'ITEMS',
        },
        {
            key: 'quantity',
            label: 'QTY',
        },
        {
            key: 'price',
            label: 'PRICE',
            class: 'ltr:text-right rtl:text-left',
        },
        {
            key: 'amount',
            label: 'AMOUNT',
            class: 'ltr:text-right rtl:text-left',
        },
    ]);

    const print = () => {
        window.print();
    };
</script>
