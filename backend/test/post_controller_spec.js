import { expect } from 'chai'
import request from 'supertest';
import app from '../src/app'
import {
  postOrganisation,
  editOrganisation,
  deleteBranch
} from '../src/controllers/post_controller'

describe('Test post controller functions', () => {
  it('Should add new organization', async () => {
    const organisation = {
      org_name: 'Test',
      website: 'www.test.com',
      branch: {
        borough: 'test',
        project: 'test',
        tag: 'test',
        service: [
          {
            service: 'test',
            service_days: 'Monday',
            process: 'test',
            categories: [
              {
                cat_name: 'test'
              }
            ]
          }
        ],
        address: [
          {
            area: 'test',
            address_line: 'test',
            postcode: 'test',
            email_address: 'test@hotmail.com',
            telephone: 'test',
            location: [
              {
                lat: 'test',
                long: 'test'
              }
            ]
          }
        ]
      }
    }
    const result = await postOrganisation(organisation);
    expect(result).to.be.a('object')
    expect(result.org_name).to.equal('Test')
  })

  it('Should edit an organization', async () => {
    const orgId = 2; const branchId = 1;
    const serviceId = 1; const addressId = 1;
    const organisation = {
      id: orgId,
      org_name: 'Test',
      website: 'test',
      branch: [
        {
          id: branchId,
          borough: 'test',
          project: 'test',
          tag: 'test',
          clients: 'test',
          address: [
            {
              id: addressId,
              address_line: 'test',
              area: 'test',
              postcode: 'test',
              email_address: 'test@hotmail.com',
              telephone: 'test',
              location: [
                {
                  lat: 'test',
                  long: 'test'
                }
              ]
            }
          ],
          service: [
            {
              id: serviceId,
              service_days: 'test',
              service: 'test',
              process: 'test',
              categories: [
                {
                  cat_name: 'test'
                }
              ]
            }
          ]
        }
      ]
    }
    const result = await editOrganisation(organisation, orgId, branchId);
    expect(result).to.be.a('object')
    expect(result.org_name).to.equal('Test')
  })

  it.skip('Should delete branch return the number of deleted branch', async () => {
    const orgId = 1; const branchId = 2;
    const result = await deleteBranch(orgId, branchId);
    expect(result).to.be.a('number')
    expect(result).to.equal(1)
  })

  it.skip('Should return empty array for branch its id equal 2 and using organisation id equal 1', async () => {
    const result = await request(app).get('/api/service/organisation/branch/?orgId=1&&branchId=2')
      .expect('Content-Type', /json/);
    expect(result.body).to.be.a('array')
    expect(result.body).to.have.lengthOf(0)
  })
})
